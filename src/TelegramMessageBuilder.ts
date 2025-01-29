import { OfficialLink, PfTokenAmountResponse } from "./ResponseModel";

export default class TelegramMessageBuilder {
    public static buildMessage(data: PfTokenAmountResponse): string {
        let res = `<code>${data.mintId}</code>
<code>Dev</code>\n`;
        let linkMessage = this.buildOfficialLinkMessage(data.officialLinks);
        res += `├Made: ${data.made} <a href="https://t.me/z99bot?start=dev_${data.mintId}">🔎\n</a>`;
        res += `${linkMessage}`;
        res += this.getChartMessage(data.mintId);
        res += this.getRefLink(data.mintId);
        res += `<code>_______________________________</code>`;
        return res;
    }

    private static getChartMessage(mintId: string): string {
        let result = [`📈 <a href="https://mevx.io/solana/${mintId}?ref=kdq9n2LcYEDa"><b><u>MevX</u></b></a>`];
        result.push(`<a href ='https://gmgn.ai/sol/token/huzhlbxK_${mintId}'>GMGN</a>`);
        return result.join(' • ') + '\n';
    }

    private static getRefLink(address: string): string {
        let result = '🤖 ';
        let msg = [];
        msg.push(`<a href="https://t.me/BloomSolanaEu2_bot?start=sniper_${address}"><b>Bloom</b></a>`);
        result = result + msg.join(' • ') + '\n';
        return result;
    }

    private static buildOfficialLinkMessage(officialLinks: OfficialLink): string {
        const links = [];
        if (officialLinks.website)
            links.push(`<a href="${officialLinks.website}">Web</a>`)
        if (officialLinks.telegram)
            links.push(`<a href="${officialLinks.telegram}">TG</a>`)
        if (officialLinks.twitter)
            links.push(`<a href="${officialLinks.twitter}">𝕏</a>`)
        if (links.length === 0)
            return '';
        return '└' + links.join(' | ') + '\n';
    }
}
