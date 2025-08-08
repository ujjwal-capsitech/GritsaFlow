//Models/Users.cs
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Diagnostics.Contracts;

namespace GritsaFlow.Models

{
    public class User
    {
        [BsonId]
        [JsonPropertyName("id")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        public string Role { get; set; } = null!;

        [Required]
        [EmailAddress(ErrorMessage = "Write a Valid EmailId")]
        [StringLength(150)]
        public string Email { get; set; } = null!;
        public List<string>? ProjectId { get; set; }
        public List<string>? TaskId { get; set; }
        public string? TeamId { get; set; }
        public bool? IsActive { get; set; } = true;
        public string? Remarks { get; set; }
        public bool? IsDeleted { get; set; } = false;

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime? CreatedAt { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime? UpdatedAt { get; set; }

        public string AvatarUrl { get; set; }


    }

}

