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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { Message } from './message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@ApiTags('Messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':receiverId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'receiverId',
    type: 'string',
    description: 'Recipient User ID',
  })
  @ApiOperation({
    summary: 'Send Message',
    description: 'Send a message to another user',
  })
  @ApiBody({
    type: CreateMessageDto,
    examples: {
      shortMessage: {
        summary: 'Short Message',
        value: {
          content: 'Hi, I am interested in the job posting.',
        },
      },
      longMessage: {
        summary: 'Long Message',
        value: {
          content:
            'Hello, I am very interested in your job posting for a Senior Software Engineer position. I have 7 years of experience...',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    type: Message,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Recipient not found',
  })
  async send(
    @Request() req,
    @Param('receiverId') receiverId: string,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.send(
      req.user.sub,
      receiverId,
      createMessageDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('inbox')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get Inbox',
    description: 'Retrieve all messages received by the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    type: [Message],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async inbox(@Request() req) {
    return this.messagesService.inbox(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('conversation/:userId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'Other User ID',
  })
  @ApiOperation({
    summary: 'Get Conversation',
    description: 'Get conversation history with a specific user',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getConversation(@Request() req, @Param('userId') userId: string) {
    return this.messagesService.getConversation(req.user.sub, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':messageId')
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'messageId',
    type: 'string',
    description: 'Message ID to delete',
  })
  @ApiOperation({
    summary: 'Delete Message',
    description: 'Delete a message from your inbox',
  })
  @ApiResponse({
    status: 200,
    description: 'Message deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  async deleteMessage(@Request() req, @Param('messageId') messageId: string) {
    return this.messagesService.deleteMessage(messageId, req.user.sub);
  }
}
