class TransactionAdapter {
  constructor() {}
  adapterAllEvents(tx: any): any[] {
    return tx.map((event: any) => {
      return {
        eventId: event[0].toNumber(),
        organizer: event[1],
        title: event[2],
        maxParticipants: event[3].toNumber(),
        registrationDeadline: event[4].toNumber(),
        cardContracts: event[5],
        rewardTokenId: event[6].toNumber(),
        shortList: event[7],
        participants: event[8],
        closed: event[9]
        // image: event[10]
      };
    });
  }

  adaptGetEventById(tx: any): any {
    return {
      eventId: tx[0].toNumber(),
      organizer: tx[1],
      title: tx[2],
      maxParticipants: tx[3].toNumber(),
      registrationDeadline: tx[4].toNumber(),
      cardContracts: tx[5],
      rewardTokenId: tx[6].toNumber(),
      shortList: tx[7],
      participants: tx[8],
      closed: tx[9]
      // image: tx[10]
    };
  }
}
export default TransactionAdapter;
