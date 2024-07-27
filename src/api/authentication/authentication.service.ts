import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { StravaMetadata, UserEntity } from "src/model/user.entity";
import { Repository } from "typeorm";

@Injectable()
export default class AuthenticationService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async stravaLogin(code: string) {
        const CLIENT_ID = this.configService.get('STRAVA_CLIENT_ID');
        const CLIENT_SECRET = this.configService.get('STRAVA_CLIENT_SECRET');

        let userId: string = '';
        let userName: string = '';

        try {
            const { data } = await axios.post(`https://www.strava.com/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=authorization_code`);

            if(!data.athlete) {
                throw new BadRequestException('Invalid code');
            }

            const user = await this.userRepository.findOne({ where: { stravaId: data.athlete.id as string } });

            if(!user){
                const newUser = await this.userRepository.create({
                    email: data.athlete.email,
                    fullName: `${data.athlete.firstname} ${data.athlete.lastname}`,
                    stravaId: data.athlete.id,
                    stravaRefreshToken: data.refresh_token,
                    stravaMetadata: data.athlete as StravaMetadata,
                    profile: data.athlete.profile_medium || '',
                    username: data.athlete.username || '',
                })

              await this.userRepository.save(newUser);

              userId = newUser.id;
              userName = newUser.username;
              

            } else {
                
                user.stravaRefreshToken = data.refresh_token;
                user.stravaMetadata = data.athlete as StravaMetadata;
                user.profile = data.athlete.profile_medium || '';

                await this.userRepository.save(user);

                userId = user.id;
                userName = user.username;

            }

            const payload = {
                id: userId,
                username: userName,
            }
         
            const token = await this.jwtService.signAsync(payload);

            return {
                token
            }
        }
        catch (e) {
            console.log(e);
            throw new BadRequestException('Error in Strava Login');
        }
    }
}