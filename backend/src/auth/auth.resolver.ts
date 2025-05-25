import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { Token } from './entities/token.entity';

@Resolver(() => Token)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Public()
  @Mutation(() => Token)
  async login(@Args('input') loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Mutation(() => Token)
  async register(@Args('input') registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Mutation(() => Token)
  async refreshToken(@Args('input') refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
