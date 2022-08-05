import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { getRandomNumber } from 'src/shared/utils';
import { CreateReactionCommand } from './commands/create-reaction.command';
import { ReactionsRepository } from './reactions.repository';

@CommandHandler(CreateReactionCommand)
export class CreateReactionHandler
  implements ICommandHandler<CreateReactionCommand>
{
  constructor(private readonly reactionRepository: ReactionsRepository) {}

  async execute(command: CreateReactionCommand) {
    const reaction = {
      ...command,
      id: getRandomNumber().toString(),
      addedAt: new Date(),
    };
    return this.reactionRepository.create(reaction as any);
  }
}
