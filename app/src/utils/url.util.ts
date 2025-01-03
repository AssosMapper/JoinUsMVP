export const buildUrl = (baseUrl: string, params: Record<string, string>) => {
    return Object.entries(params).reduce((url, [key, value]) => {
        return url.replace(`{${key}}`, value);
    }, baseUrl);
};
