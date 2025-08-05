using GritsaFlow.Models;
using GritsaFlow.Server.Models;
using MongoDB.Driver;
using System.Threading.Tasks;
using System;

namespace GritsaFlow.Server.Services
{
    public class ProjectTimelineServices
    {
        private readonly IMongoCollection<ProjectTimeLine> _ProjectTimeLine;

        public ProjectTimelineServices(IMongoDatabase db)
        {
            _ProjectTimeLine = db.GetCollection<ProjectTimeLine>("ProjectTimeLine");
        }

        public async Task<List<ProjectTimeLine>> GetAllAsync() =>
            await _ProjectTimeLine.Find(_ => true).ToListAsync();

        public async Task LogActivityAsync(ProjectTimeLine timelineEntry)
        {
            timelineEntry.updatedAt = DateTime.UtcNow; // Ensure we set the correct timestamp
            await _ProjectTimeLine.InsertOneAsync(timelineEntry); // Insert activity log into the timeline
        }
    }
}
