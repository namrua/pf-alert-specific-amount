export interface PfTokenAmountResponse {
    mintId: string;
    made: number;
    officialLinks: OfficialLink;
}

export interface OfficialLink {
    website?: string;
    telegram?: string;
    twitter?: string;
  }