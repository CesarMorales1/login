export default class User
{
    constructor({username,password,email,nombre,telephone})
    {
        this.username = username;
        this.password = password;
        this.email = email;
        this.nombre = nombre;
        this.telephone = telephone;
    }

    static validatePassword(password)
    {
    const regex = /^(?=(?:[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]){2,})(?=.*\d).{10,}$/;
    return regex.test(password);
    }

    static validateEmail(email)
    {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validaTelephone(telephone){
        const regex = /^\d{11}$/;
        return regex.test(telephone);
    }

    static validateNombre(nombre)
    {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(nombre);
    }
}