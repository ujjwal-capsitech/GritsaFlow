using GritsaFlow.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace GritsaFlow.Server.Models
{
    public class ProjectTimeLine
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? id { get; set; }
        public string? TaskID { get; set; }
        public string? ProjectID { get; set; }
        public string UserName { get; set; }
        public string avatarurl { get; set; }
        public string ActivityDescription { get; set; }
        public Updator updator { get; set; }
        public string statefrom { get; set; }
        public string stateTo { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime updatedAt { get; set; }
    }
}

