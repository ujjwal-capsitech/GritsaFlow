using GritsaFlow.Server.Models;
using MongoDB.Driver;

namespace GritsaFlow.Server.Services
{
    public class ProjectTimelineServices
    {
        private readonly IMongoCollection<ProjectTimeLine> _projectTimeLine;

        public ProjectTimelineServices(IMongoDatabase db)
        {
            _projectTimeLine = db.GetCollection<ProjectTimeLine>("ProjectTimeLine");
        }

        public async Task<List<ProjectTimeLine>> GetAllAsync() =>
            await _projectTimeLine.Find(_ => true).ToListAsync();
        public async Task<List<ProjectTimeLine>> GetByProjectIdAsync(string projectId) =>
            await _projectTimeLine.Find(t => t.ProjectID == projectId).ToListAsync();


        public async Task LogActivityAsync(ProjectTimeLine timelineEntry)
        {
            timelineEntry.updatedAt = DateTime.UtcNow; // Ensure timestamp
            await _projectTimeLine.InsertOneAsync(timelineEntry);
        }
    }
}
    