# API Documentation Structure

This project uses **standalone YAML files** for API documentation, completely separated from source code. This approach provides better maintainability, version control, and collaboration.

## 📁 Documentation Structure

```
docs/
└── api/
    ├── openapi.yml              # Main OpenAPI specification
    ├── schemas/                 # Reusable data schemas
    │   ├── create-user-dto.yml  # User creation request schema
    │   ├── user-response.yml    # User response schema
    │   └── errors.yml           # Common error schemas
    └── paths/                   # API endpoint definitions
        ├── user-register.yml    # POST /user/register
        └── user-profile.yml     # GET /user/profile
```

## 🎯 Benefits of This Approach

### ✅ **Clean Source Code**
- No API documentation decorators cluttering the code
- Pure business logic without documentation overhead
- Easier to read and maintain controllers/DTOs

### ✅ **Centralized Documentation**
- All API docs in one place (`docs/api/`)
- Easy to find and update documentation
- Better organization with modular YAML files

### ✅ **Version Control Friendly**
- Documentation changes are clearly visible in git diffs
- Easy to review API changes in PRs
- Documentation can be versioned independently

### ✅ **Team Collaboration**
- Technical writers can work on docs without touching code
- Frontend developers can work from docs before backend is ready
- API-first development approach

### ✅ **Flexible and Powerful**
- Full OpenAPI 3.0 feature support
- Rich examples and detailed descriptions
- Custom documentation structure

## 📝 How to Add New Endpoints

### 1. Create Path Definition
Create a new file in `docs/api/paths/` for your endpoint:

```yaml
# docs/api/paths/auth-login.yml
auth_login:
  post:
    tags:
      - Authentication
    summary: User login
    description: Authenticate user with email and password
    operationId: loginUser
    requestBody:
      required: true
      content:
        application/json:
          schema:
            $ref: '../schemas/login-dto.yml#/LoginDto'
    responses:
      '200':
        description: Login successful
        content:
          application/json:
            schema:
              $ref: '../schemas/auth-response.yml#/AuthResponse'
```

### 2. Create Schema Definitions
Add any new schemas to `docs/api/schemas/`:

```yaml
# docs/api/schemas/login-dto.yml
LoginDto:
  type: object
  required:
    - email
    - password
  properties:
    email:
      type: string
      format: email
      example: "user@example.com"
    password:
      type: string
      format: password
      example: "password123"
```

### 3. Update Main OpenAPI File
Add the new path to `docs/api/openapi.yml`:

```yaml
paths:
  /auth/login:
    $ref: './paths/auth-login.yml#/auth_login'
  
components:
  schemas:
    LoginDto:
      $ref: './schemas/login-dto.yml#/LoginDto'
```

### 4. Write Clean Source Code
Keep your controllers simple and clean:

```typescript
@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

## 🚀 Running Documentation

### Development Server
```bash
npm run start:dev
```

### Access Documentation
- **Swagger UI**: http://localhost:3000/api-docs
- **JSON Format**: http://localhost:3000/api-docs/json
- **YAML Format**: http://localhost:3000/api-docs/yaml

## 🔧 Features

### Rich Examples
Each endpoint includes multiple examples:
- Minimal requests (required fields only)
- Complete requests (all fields)
- Business/edge case scenarios

### Comprehensive Error Handling
Standardized error responses:
- `400` - Validation errors
- `401` - Authentication errors
- `403` - Authorization errors
- `404` - Resource not found
- `409` - Conflicts (duplicate resources)
- `500` - Server errors

### Modular Structure
- **Schemas**: Reusable data models
- **Paths**: Individual endpoint definitions
- **Main**: Orchestrates everything together

## 📋 Best Practices

### 1. **File Naming**
- Use kebab-case: `user-profile.yml`
- Be descriptive: `auth-refresh-token.yml`
- Group related operations: `user-*`, `auth-*`

### 2. **Schema Organization**
- One schema per file for complex models
- Group simple schemas in common files (like `errors.yml`)
- Use clear, descriptive names

### 3. **Documentation Quality**
- Write clear, concise descriptions
- Include realistic examples
- Document all possible responses
- Explain business logic and constraints

### 4. **Reference Management**
- Use relative paths: `../schemas/user.yml`
- Consistent reference structure
- Avoid deep nesting of references

## 🔄 Workflow

1. **Design API** in YAML first (API-first approach)
2. **Review documentation** with team/stakeholders
3. **Implement endpoints** in clean TypeScript
4. **Test against documentation** for consistency
5. **Update docs** as API evolves

This approach ensures your API documentation is always accurate, comprehensive, and maintainable while keeping your source code clean and focused on business logic.