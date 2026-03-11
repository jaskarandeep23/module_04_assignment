export const successResponse = (
    data: unknown,
    message: string = "Request successful"
) => ({
    message,
    data,
});

export const errorResponse = (
    message: string,
    code: string
) => ({
    success: false,
    error: {
        message,
        code,
    },
    timestamp: new Date().toISOString(),
});