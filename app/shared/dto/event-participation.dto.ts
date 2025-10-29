import { Expose, Type } from "class-transformer";
import { EventDto } from "./events.dto";
import { PublicUserDto } from "./user.dto";

export class ParticipateEventDto {
  eventId: string;
}

export class EventParticipationResponseDto {
  @Expose()
  id: string;

  @Expose()
  eventId: string;

  @Expose()
  userId: string;

  @Expose()
  registrationDate: Date;
}

export class EventParticipantResponseDto {
  @Expose()
  id: string;

  @Expose()
  eventId: string;

  @Expose()
  registrationDate: Date;

  @Expose()
  @Type(() => PublicUserDto)
  user: PublicUserDto;
}

export class UserParticipationResponseDto {
  @Expose()
  id: string;

  @Expose()
  registrationDate: Date;

  @Expose()
  @Type(() => EventDto)
  event: EventDto;
}
