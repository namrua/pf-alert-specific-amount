export interface QueryParams {
    [key: string]: any;
}

export const ClickhouseQuery = {
    GET_DEPLOYER_HISTORY: `WITH 
    (SELECT DISTINCT deployerId FROM TokenInfo WHERE mintId = '{mintId}') AS targetDeployerId
        SELECT COUNT( DISTINCT ti.mintId) AS made
        FROM TokenInfo ti 
        WHERE deployerId = targetDeployerId`,

    GET_TOKEN_INFO: `SELECT * FROM TokenInfo WHERE mintId = '{mintId}'`,
}