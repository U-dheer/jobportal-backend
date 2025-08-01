import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../users/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto) {
        const existing = await this.userModel.findOne({ email: createUserDto.email });
        if (existing) throw new ConflictException('Email already registered');
        const hash = await bcrypt.hash(createUserDto.password, 10);
        const user = new this.userModel({ ...createUserDto, password: hash });
        await user.save();
        return { message: 'Registration successful' };
    }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        const payload = { sub: user._id, role: user.role };
        const token = await this.jwtService.signAsync(payload);
        return { access_token: token, user: { id: user._id, email: user.email, role: user.role } };
    }
}
