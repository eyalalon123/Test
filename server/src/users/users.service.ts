import { Injectable } from '@nestjs/common';
import { usersDTO } from './DTO/user.dto';

@Injectable()
export class UsersService {
    users: usersDTO[] = [];
    constructor() {
        const user1: usersDTO = new usersDTO();
        user1._id = "1";
        user1.name = "eyal";
        user1.phoneNumber = "0586537099"

        const user2: usersDTO = new usersDTO();
        user2._id = "2";
        user2.name = "hadar";
        user2.phoneNumber = "0547657899"

        const user3: usersDTO = new usersDTO();
        user3._id = "3";
        user3.name = "alon";
        user3.phoneNumber = "0587335877"

        this.users.push(user1)
        this.users.push(user2)
        this.users.push(user3)
    }
    getAllUsers() : usersDTO[]{
        return this.users
    }
}
