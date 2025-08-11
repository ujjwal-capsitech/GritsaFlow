using GritsaFlow.DTOs;
using GritsaFlow.Models;
using GritsaFlow.Server.Models;

namespace GritsaFlow
{
    // Non-generic base for simpler cases
    public class ApiResponse
    {
        public bool Status { get; set; }
        public string Message { get; set; }

        public ApiResponse(bool status, string message)
        {
            Status = status;
            Message = message;
        }

        public static ApiResponse Ok(string message = "Success") =>
            new ApiResponse(true, message);

        public static ApiResponse Error(string message = "Something went wrong") =>
            new ApiResponse(false, message);

        
    }

    // Generic for data cases
    public class ApiResponse<T> : ApiResponse
    {
        public T? Data { get; set; }

        public ApiResponse(bool status, string message, T? data = default)
            : base(status, message)
        {
            Data = data;
        }

        public static ApiResponse<T> Ok(T? data, string message = "Success") =>
            new ApiResponse<T>(true, message, data);

        public static ApiResponse<T> Error(string message = "Failed", T? data = default) =>
            new ApiResponse<T>(false, message, data);
    }

    public class ValidationErrorResponse
    {
        public bool Status { get; set; } = false;
        public string Message { get; set; } = "Validation Failed";
        public Dictionary<string, string[]> Errors { get; set; } = new();
    }
}