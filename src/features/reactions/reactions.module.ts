import { Reaction, ReactionSchema } from './entities/reaction.schema';
import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { ReactionsRepository } from './reactions.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateReactionHandler } from './createReactionUseCase.handler';

export const CommandHandlers = [CreateReactionHandler];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    CqrsModule,
  ],
  controllers: [ReactionsController],
  providers: [
    ReactionsService,
    { provide: ReactionsRepository, useClass: ReactionsRepository },
    ...CommandHandlers,
  ],
  exports: [ReactionsRepository],
})
export class ReactionsModule {}