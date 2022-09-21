export const GET_CHALLENGE = `query($request: ChallengeRequest!) {
    challenge(request: $request) {
          text
      }
    }
  `
