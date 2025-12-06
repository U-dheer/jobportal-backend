import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @UseGuards(JwtAuthGuard)
    @Post(':receiverId')
    async send(@Request() req, @Param('receiverId') receiverId: string, @Body() createMessageDto: CreateMessageDto) {
        return this.messagesService.send(req.user.sub, receiverId, createMessageDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('inbox')
    async inbox(@Request() req) {
        return this.messagesService.inbox(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Get('conversation/:userId')
    async getConversation(@Request() req, @Param('userId') userId: string) {
        return this.messagesService.getConversation(req.user.sub, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':messageId')
    async deleteMessage(@Request() req, @Param('messageId') messageId: string) {
        return this.messagesService.deleteMessage(messageId, req.user.sub);
    }
}
