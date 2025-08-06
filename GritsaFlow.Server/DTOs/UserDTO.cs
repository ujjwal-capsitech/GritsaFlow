using GritsaFlow.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace GritsaFlow.DTOs
{
    public class UserDTO
    {
        
        public string UserId { get; set; } = null!;
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string UserName { get; set; } = null!;
        [Required]
        public string Password { get; set; } = null!;
        [Required]
        public string Role { get; set; } = null!;
        [Required]
        public string Email { get; set; } = null!;
        public string AvatarUrl { get; set; }
       
    }
}
