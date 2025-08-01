import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) { }

    async send(senderId: string, receiverId: string, dto: CreateMessageDto) {
        const message = new this.messageModel({ ...dto, senderId, receiverId });
        await message.save();
        return message;
    }

    async inbox(userId: string) {
        return this.messageModel.find({ receiverId: userId });
    }

    async getConversation(userId1: string, userId2: string) {
        return this.messageModel.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 },
            ],
        }).sort({ createdAt: 1 });
    }
}
