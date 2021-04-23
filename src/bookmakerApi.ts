declare global {
  interface GermesData {
    inplayIFrame: HTMLIFrameElement;
  }
}

export const clearGermesData = (): void => {
  window.germesData = {
    bookmakerName: 'Efbet',
    minimumStake: undefined,
    maximumStake: undefined,
    doStakeTime: undefined,
    betProcessingStep: undefined,
    betProcessingAdditionalInfo: undefined,
    betProcessingTimeout: 50000,
    stakeDisabled: undefined,
    stopBetProcessing: () => {
      window.germesData.betProcessingStep = 'error';
      window.germesData.stakeDisabled = true;
    },

    inplayIFrame: undefined,
  };
};

export default {};
