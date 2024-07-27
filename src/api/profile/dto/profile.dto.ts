import { IsString } from "class-validator";

export class UpdateProfileDto {
    @IsString()
    username: string;

    @IsString()
    fullName: string;
}