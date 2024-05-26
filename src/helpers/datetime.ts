export const formatDateTime = (rowDateTime: string) => {
    return new Date(rowDateTime).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    })
}

export const formatDate = (rowDateTime: string) => {
    return new Date(rowDateTime).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export const formatDateForm = (rowDateTime: string) => {
    const date = new Date(rowDateTime);
    return `${date.getFullYear()}-${('0' + (date.getMonth()+1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
}