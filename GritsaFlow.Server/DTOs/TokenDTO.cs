using MongoDB.Bson.Serialization.Attributes;

namespace GritsaFlow.DTOs
{
    public class RefreshToken
    {
        [BsonId]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string UserId { get; set; } = null!;
        public string Token { get; set; } = null!;
        public DateTime ExpiryDate { get; set; }
    }
    // TokenDTO

}
