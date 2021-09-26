import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyAll {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const userRole = auth.user?.role
    if (userRole === 'owner' || userRole === 'user') {
      await next()
    } else {
      return response.unauthorized({ message: "anda tidak bisa mengakses halaman ini" })
    }
  }
}
