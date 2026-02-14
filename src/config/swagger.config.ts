import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Job Portal API')
    .setDescription(
      'A comprehensive, production-ready API for managing jobs, applications, users, and messaging. ' +
        'This system supports multiple user roles: JobSeeker, Employer, and Admin. ' +
        'Built with NestJS and follows RESTful conventions.',
    )
    .setVersion('1.0.0')
    .setTermsOfService('https://jobportal.example.com/terms')
    .setContact(
      'Job Portal Support',
      'https://jobportal.example.com',
      'support@jobportal.example.com',
    )
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.jobportal.example.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token obtained from /auth/login endpoint',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .addTag(
      'Auth',
      'Authentication endpoints - User registration and login with JWT',
    )
    .addTag('Users', 'User profile management, updates, and resume uploads')
    .addTag('Jobs', 'Job postings creation, filtering, and management')
    .addTag('Applications', 'Job application submission and status management')
    .addTag('Messages', 'Messaging system between users')
    .addTag(
      'Admin',
      'Administrative operations - User management and system reports',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
      tryItOutEnabled: true,
    },
    customCss: `
      :root {
        color-scheme: dark;
      }
      body {
        background: #1a1a1a;
        color: #e0e0e0;
      }
      .swagger-ui {
        background: #1a1a1a;
        color: #e0e0e0;
      }
      .topbar {
        background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }
      .swagger-ui .topbar-wrapper {
        background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
      }
      .swagger-ui .info {
        margin: 20px 0;
        background: #2d2d2d;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid #667eea;
        color: #e0e0e0;
      }
      .swagger-ui .info .title {
        color: #667eea;
        font-size: 28px;
        font-weight: 700;
      }
      .swagger-ui .info .description {
        color: #b0b0b0;
        font-size: 14px;
        line-height: 1.6;
      }
      .swagger-ui .scheme-container {
        background: #2d2d2d;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        border: 1px solid #444;
        color: #e0e0e0;
      }
      .swagger-ui .btn {
        border-radius: 4px;
        padding: 8px 16px;
        font-weight: 600;
        transition: all 0.3s ease;
      }
      .swagger-ui .btn-authorize {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
      }
      .swagger-ui .btn-authorize:hover {
        background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      .swagger-ui .model-box {
        border-radius: 8px;
        margin: 10px 0;
        border: 1px solid #444;
        background: #2d2d2d;
        color: #e0e0e0;
      }
      .swagger-ui .response-col_description {
        max-width: 60%;
        color: #e0e0e0;
      }
      .swagger-ui .response-col_links {
        max-width: 60%;
      }
      .swagger-ui .model {
        background: #2d2d2d;
        color: #e0e0e0;
      }
      .swagger-ui .opblock {
        border-radius: 8px;
        margin: 8px 0;
        border: 1px solid #444;
        background: #252525;
      }
      .swagger-ui .opblock.opblock-post {
        background: rgba(51, 188, 133, 0.1);
        border-color: #33bc85;
      }
      .swagger-ui .opblock.opblock-get {
        background: rgba(102, 126, 234, 0.1);
        border-color: #667eea;
      }
      .swagger-ui .opblock.opblock-patch {
        background: rgba(252, 161, 27, 0.1);
        border-color: #fca11b;
      }
      .swagger-ui .opblock.opblock-delete {
        background: rgba(249, 62, 62, 0.1);
        border-color: #f93e3e;
      }
      .swagger-ui .opblock-tag {
        color: #e0e0e0;
        border-color: #444;
      }
      .swagger-ui .opblock-summary {
        background: #2d2d2d;
        border-color: #444;
      }
      .swagger-ui input,
      .swagger-ui textarea,
      .swagger-ui select {
        background: #3d3d3d;
        border: 1px solid #555;
        color: #e0e0e0;
      }
      .swagger-ui input:focus,
      .swagger-ui textarea:focus,
      .swagger-ui select:focus {
        background: #4d4d4d;
        border-color: #667eea;
        outline: none;
      }
      .swagger-ui .model-properties {
        color: #e0e0e0;
      }
      .swagger-ui .prop-type {
        color: #667eea;
      }
      .swagger-ui table {
        background: #2d2d2d;
        color: #e0e0e0;
      }
      .swagger-ui table tr {
        background: #2d2d2d;
        border-color: #444;
      }
      .swagger-ui table td {
        border-color: #444;
        color: #e0e0e0;
      }
      .swagger-ui .response-control-media-type--accept-controller {
        background: #3d3d3d;
      }
      .swagger-ui .try-out {
        background: #2d2d2d;
      }
      .swagger-ui .execute-wrapper {
        background: #2d2d2d;
      }
      .swagger-ui .btn-execute {
        background: linear-gradient(135deg, #33bc85 0%, #2ecc71 100%);
        color: white;
        border: none;
      }
      .swagger-ui .btn-execute:hover {
        background: linear-gradient(135deg, #2ecc71 0%, #33bc85 100%);
      }
      .swagger-ui .response {
        background: #2d2d2d;
        color: #e0e0e0;
      }
      .swagger-ui pre {
        background: #1a1a1a;
        color: #e0e0e0;
        border: 1px solid #444;
      }
    `,
    customSiteTitle: 'Job Portal API Documentation | NestJS',
  });
}
