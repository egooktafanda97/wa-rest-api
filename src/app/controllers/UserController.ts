import 'reflect-metadata';
import {Controller, Param, Body, Get, Post, Put, Delete} from 'routing-controllers';

@Controller()
export class UserController {
    @Get('/api/users')
    getAll() {
        return 'This action returns all users';
    }
}