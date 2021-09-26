import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'

export default class AuthController {
    public async register({ request, response }: HttpContextContract) {
        const userSchema = schema.create({
            name: schema.string(),
            email: schema.string({}, [
                rules.unique({ table: 'users', column: 'email' }),
                rules.email()
            ]),
            password: schema.string({}, [
                rules.minLength(6),
                rules.confirmed()
            ]),
            role: schema.enum.optional(
                ['user', 'owner']
            ),
        })
        const payload = await request.validate({ schema: userSchema })
        console.log(payload);

        try {
            const user = new User()
            const newUser = await user.fill(payload).save()
            const otp_code = Math.floor(100000 + Math.random() * 900000)
            await Database.table('otp_codes').insert({ otp_code: otp_code, user_id: newUser.id })
            await Mail.send((message) => {
                message
                    .from('admin@mainbersama.com')
                    .to(payload.email)
                    .subject('Verification Code')
                    .htmlView('emails/otp_verify', { otp_code: otp_code })
            })
            return response.ok({ message: 'Registered, check email for verification code' })
        } catch (error) {
            if (error.messages) {
                return response.unprocessableEntity(error.messages)
            } else {
                return response.unprocessableEntity(error.message)
            }
        }
    }

    public async login({ request, response, auth }: HttpContextContract) {
        const userSchema = schema.create({
            email: schema.string(),
            password: schema.string()
        })
        const email = request.input('email')
        const password = request.input('password')
        try {
            const payload = await request.validate({ schema: userSchema })
            const user = await User.findByOrFail('email', payload.email)
            if (user.is_verified) {
                const token = await auth.use('api').attempt(email, password)
                return response.ok(token)
            } else {
                return response.unauthorized({ message: "Anda belum melakukan verifikasi" })
            }
        } catch (error) {
            if (error.messages) {
                return response.badRequest(error.messages)
            } else {
                return response.badRequest(error.message)
            }
        }
    }

    public async otpConfirm({ request, response }: HttpContextContract) {
        try {
            const otp_code = request.input('otp_code')
            const email = request.input('email')
            const user = await User.findByOrFail('email', email)
            const otpCheck = await Database.query().from('otp_codes').where('otp_code', otp_code).firstOrFail()

            if (user.id === otpCheck.user_id) {
                user.is_verified = true
                await user.save()
                return response.ok({ message: "Berhasil konfimasi OTP" })
            } else {
                return response.badRequest({ message: "Gagal Vefirikasi OTP" })
            }
        } catch (error) {
            if (error.messages) {
                return response.unprocessableEntity(error.messages)
            } else {
                return response.unprocessableEntity(error.message)
            }
        }
    }
}
