using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GritsaFlow.DTOs
{
    public class RefreshToken
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string UserId { get; set; } = null!;
        public string Token { get; set; } = null!;
        public DateTime ExpiryDate { get; set; }
    }
    

}
