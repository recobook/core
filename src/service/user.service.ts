// deno-lint-ignore-file
import connection from '../database/connection.ts'
import User from '../model/user.model.ts'


import { 
    MESSAGE_SUCESS_CREATE_USER,
    MESSAGE_USER_ALREADY_EXISTS_EMAIL,
    MESSAGE_USER_ALREADY_EXISTS_USERNAME,
    MESSAGE_INTERNAL_SERVER_ERROR,
    MESSAGE_SUCCESS_UPDATE_USER,
    MESSAGE_SUCCESS_DELETE_USER,
    MESSAGE_SUCCESS_IN_FIND_USER,
    MESSAGE_FAILD_IN_FIND_USER,
    SCHEMA_UPDATE_USER,
    SCHEMA_CREATE_USER,
    SCHEMA_DELETE_USER_BY_ID,
    SCHEMA_DELETE_USER_BY_EMAIL,
    SCHEMA_DELETE_USER_BY_USERNAME,
    SCHEMA_READ_USER_BY_USERNAME_AND_PASSWORD,
    CLIENT_DATABASE_CONFIG,
SCHEMA_READ_USER_BY_EMAIL,
MESSAGE_FAILD_IN_FIND_USER_BY_EMAIL
} from "../const.ts";

export async function create_user(user:User) {
   try {

    const errors = SCHEMA_CREATE_USER.validate(user as any)
    
    if (errors.length > 0) {
        return { error: true, message: errors[0].message, status: 400  }
    }
    await connection.connect(CLIENT_DATABASE_CONFIG)
    await connection.execute(`INSERT INTO users VALUES (NULL,?,?,?,?,?,?);`,[
        user.name,
        user.email,
        user.username,
        user.password,
        user.photo,
        user.bio
    ])
    await connection.close()

    return { error: false, message: MESSAGE_SUCESS_CREATE_USER, status: 201  }
   
    } catch (error) {
        switch (error.message) {
            case `Duplicate entry '${user.email}' for key 'email'`:
                return { error: true, message: MESSAGE_USER_ALREADY_EXISTS_EMAIL, status: 400  }
                break;
            case `Duplicate entry '${user.username}' for key 'username'`:
                return { error: true, message: MESSAGE_USER_ALREADY_EXISTS_USERNAME, status: 400  }
                break;
            default:
                return { error: true, message: MESSAGE_INTERNAL_SERVER_ERROR, status: 500  }
                break;
        }

        
   }
    
}

export async function find_user_by_username_and_password(user:User) {
    try {
 
     const errors = SCHEMA_READ_USER_BY_USERNAME_AND_PASSWORD.validate(user as any)
     
     if (errors.length > 0) {
         return { error: true, message: errors[0].message, user: null, status: 400  }
     }
     
    await connection.connect(CLIENT_DATABASE_CONFIG)
    const users: User[] = await connection.query(`SELECT id,name,email,username,photo,bio FROM users WHERE username = ? and password = ? LIMIT 1`,[ user.username, user.password ])
    await connection.close()
    
    if (users.length == 0) return { error: true, message: MESSAGE_FAILD_IN_FIND_USER, user: null, status: 400  }
     
    return { error: false, message: MESSAGE_SUCCESS_IN_FIND_USER, user: users[0], status: 201  }
    
    } catch (error) {
         switch (error.message) {
             default:
                 return { error: true, message: MESSAGE_INTERNAL_SERVER_ERROR, user: null, status: 500  }
                 break;
         }
 
         
    }
     
 }
 export async function find_user_by_email(user:User) {
    try {
 
     const errors = SCHEMA_READ_USER_BY_EMAIL.validate(user as any)
     
     if (errors.length > 0) {
         return { error: true, message: errors[0].message, user: null, status: 400  }
     }
     
    await connection.connect(CLIENT_DATABASE_CONFIG)
    const users: User[] = await connection.query(`SELECT id,name,email,username,password,photo,bio FROM users WHERE email = ? LIMIT 1`,[ user.email ])
    await connection.close()
    
    if (users.length == 0) return { error: true, message: MESSAGE_FAILD_IN_FIND_USER_BY_EMAIL, user: null, status: 400  }
     
    return { error: false, message: MESSAGE_SUCCESS_IN_FIND_USER, user: users[0], status: 201  }
    
    } catch (error) {
         switch (error.message) {
             default:
                 return { error: true, message: MESSAGE_INTERNAL_SERVER_ERROR, user: null, status: 500  }
                 break;
         }
 
         
    }
     
 }

export async function update_user(user:User) {
    try {
    
    const errors = SCHEMA_UPDATE_USER.validate(user as any)
    
    if (errors.length > 0) {
        return { error: true, message: errors[0].message, status: 400  }
    }

   if (user.password){
    await connection.connect(CLIENT_DATABASE_CONFIG)
    await connection.execute(`UPDATE users SET name = ?, email = ?, username = ?, password = ?, photo = ?, bio = ? WHERE id = ?;`,[
            user.name,
            user.email,
            user.username,
            user.password,
            user.photo,
            user.bio,
            user.id
        ])
        await connection.close()
    }else {
        await connection.connect(CLIENT_DATABASE_CONFIG)
        const users: User[] = await connection.query(`SELECT id,name,email,username,password,photo,bio FROM users WHERE email = ? LIMIT 1`,[ user.email ])
        await connection.execute(`UPDATE users SET name = ?, email = ?, username = ?, password = ?, photo = ?, bio = ? WHERE id = ?;`,[
            user.name,
            user.email,
            user.username,
            users[0].password,
            user.photo,
            user.bio,
            user.id
        ])
        await connection.close()
    }
     
    return { error: false, message: MESSAGE_SUCCESS_UPDATE_USER, status: 200  }
     
    } catch (error) {
        switch (error.message) {
             case `Duplicate entry '${user.email}' for key 'email'`:
                 return { error: true, message: MESSAGE_USER_ALREADY_EXISTS_EMAIL, status: 400  }
                 break;
             case `Duplicate entry '${user.username}' for key 'username'`:
                 return { error: true, message: MESSAGE_USER_ALREADY_EXISTS_USERNAME, status: 400  }
                 break;
             default:
                 return { error: true, message: MESSAGE_INTERNAL_SERVER_ERROR, status: 500  }
                 break;
         }
 
         
    }
     
}

export async function delete_user_by_id(user:User){
    try {

        const errors = SCHEMA_DELETE_USER_BY_ID.validate(user as any)
    
        if (errors.length > 0) {
            return { error: true, message: errors[0].message, status: 400  }
        }
        await connection.connect(CLIENT_DATABASE_CONFIG)
        await connection.execute(`DELETE FROM users WHERE id = ?;`,[
            user.id
        ])
        await connection.close()
        return { error: false, message: MESSAGE_SUCCESS_DELETE_USER, status: 200  }
       
    } catch (error) {
        switch (error.message) {
            default:
                return { error: true, message: MESSAGE_INTERNAL_SERVER_ERROR, status: 500  }
                break;
        }
    }
}

export async function delete_user_by_email(user:User){
    try {

        const errors = SCHEMA_DELETE_USER_BY_EMAIL.validate(user as any)
    
        if (errors.length > 0) {
            return { error: true, message: errors[0].message, status: 400  }
        }
        await connection.connect(CLIENT_DATABASE_CONFIG)
        await connection.execute(`DELETE FROM users WHERE email = ?;`,[
            user.email
        ])
        await connection.close()
        return { error: false, message: MESSAGE_SUCCESS_DELETE_USER, status: 200  }
       
    } catch (error) {
        switch (error.message) {
            default:
                return { error: true, message: MESSAGE_INTERNAL_SERVER_ERROR, status: 500  }
                break;
        }
    }
}

export async function delete_user_by_username(user:User){
    try {

        const errors = SCHEMA_DELETE_USER_BY_USERNAME.validate(user as any)
    
        if (errors.length > 0) {
            return { error: true, message: errors[0].message, status: 400  }
        }
        await connection.connect(CLIENT_DATABASE_CONFIG)
        await connection.execute(`DELETE FROM users WHERE username = ?;`,[
            user.username
        ])
        await connection.close()
        return { error: false, message: MESSAGE_SUCCESS_DELETE_USER, status: 200  }
       
    } catch (error) {
        switch (error.message) {
            default:
                return { error: true, message: MESSAGE_INTERNAL_SERVER_ERROR, status: 500  }
                break;
        }
    }
}