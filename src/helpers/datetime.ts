export const formatDateTime = (rowDateTime: string) => {
    return new Date(rowDateTime).toLocaleDateString('en-en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    })
}