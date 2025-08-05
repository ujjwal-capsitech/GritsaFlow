
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace GritsaFlow.Models
{
    

    public class Tasks
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? TaskId { get; set; }

        public string Title { get; set; } = null!;

        public projects Project { get; set; } 

        [EnumDataType(typeof(TaskStatus))]
        public TaskStatus TaskStatus { get; set; }

        [EnumDataType(typeof(TaskPriority))]
        public TaskPriority Priority { get; set; }   

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime DueDate { get; set; }

        public string AssignedToId { get; set; } = null!;
        public string ReportToId { get; set; } = null!;
        public List<Comments>? Comments { get; set; }
        public string? Description { get; set; }
        public bool IsDeleted { get; set; } = false;
        public Creator Creator { get; set; }
        public Updator Updator { get; set; }
    }

    public class projects
    {
        public string ProjectId { get; set; }
        public string projectTitle { get; set; }
    }
    public class Comments
    {
        public string Name { get; set; }
        public string Comment { get; set; }
        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime createdAt { get; set; }

    }
    
    public enum TaskStatus
    {
        Backlog,
        NeedToDiscuss,
        Todo,
        InProgress,
        Developed,
        UAT,
        Testing,
        Done
    }
    public enum TaskPriority
    {
        high,
        Medium ,
        Low,
    }
}

