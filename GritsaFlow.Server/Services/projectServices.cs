using GritsaFlow.DTOs;
using GritsaFlow.Models;
using MongoDB.Driver;

namespace GritsaFlow.Services
{
    public class projectServices
    {
        private readonly IMongoCollection<Project> _projects;
        private readonly IMongoCollection<Tasks> _tasks;

        public projectServices(IMongoDatabase db)
        {
            _projects = db.GetCollection<Project>("projects");
            _tasks = db.GetCollection<Tasks>("tasks");
        }

        public async Task CreateProjectAsync(Project newProject, string creatorId, string creatorName)
        {
            newProject.Creator = new Creator
            {
                Id = creatorId,
                Name = creatorName,
                CreatedAt = DateTime.UtcNow
            };
            //newProject.ProjectId = Guid.NewGuid().ToString()
            newProject.IsDeleted = false;

            await _projects.InsertOneAsync(newProject);
        }

        public async Task<Project?> GetByidAsync(string ProjectId) =>
            await _projects.Find(u => u.ProjectId == ProjectId && !u.IsDeleted).FirstOrDefaultAsync();

        public async Task<bool> UpdateDescriptionAsync(string ProjectId, string newDescription, string updatorId, string updatorName)
        {
            var update = Builders<Project>.Update
                .Set(t => t.ProjectDescription, newDescription)
                .Set(t => t.Updator, new Updator
                {
                    Id = updatorId,
                    Name = updatorName,
                    UpdatedAt = DateTime.UtcNow
                });

            var result = await _projects.UpdateOneAsync(
                t => t.ProjectId == ProjectId && !t.IsDeleted,
                update
            );

            return result.ModifiedCount > 0;
        }
        public async Task<ProjectReportResponse> GetProjectReportAsync(string projectId)
        {
            var project = await _projects
                .Find(p => p.ProjectId == projectId && !p.IsDeleted)
                .FirstOrDefaultAsync();

            if (project == null)
                return new ProjectReportResponse();

            var tasks = await _tasks
                .Find(t => t.Project.ProjectId == projectId && !t.IsDeleted)
                .ToListAsync();

            if (!tasks.Any())
                return new ProjectReportResponse();

            var statusReport = tasks
                .GroupBy(t => t.TaskStatus.ToString())
                .Select(g => new TaskReportDto
                {
                    Name = g.Key,
                    Value = g.Count()
                })
                .ToList();

            var priorityReport = tasks
                .GroupBy(t => t.Priority.ToString())
                .Select(g => new TaskReportDto
                {
                    Name = g.Key,
                    Value = g.Count()
                })
                .ToList();

            return new ProjectReportResponse
            {
                StatusReport = statusReport,
                PriorityReport = priorityReport
            };
        }


        public async Task<Project?> EditByidAsync(string ProjectId, Project updatedProject, string updatorId, string updatorName)
        {
            var existingProjcet = await _projects.Find(t => t.ProjectId == ProjectId && !t.IsDeleted).FirstOrDefaultAsync();

            if (existingProjcet == null)
                return null;

            updatedProject.Id = existingProjcet.Id;
            updatedProject.ProjectId = ProjectId;
            updatedProject.Updator = new Updator
            {
                Id = updatorId,
                Name = updatorName,
                UpdatedAt = DateTime.UtcNow
            };

            await _projects.ReplaceOneAsync(t => t.ProjectId == ProjectId, updatedProject);

            return updatedProject;
        }

        public async Task<List<Project>> GetAllAsync() =>
            await _projects.Find(p => !p.IsDeleted).ToListAsync();

        //public async Task<List<TaskReportDto>> GetProjectReportAsync(string projectId)
        //{
     
        //    var project = await _projects
        //        .Find(p => p.ProjectId == projectId && !p.IsDeleted)
        //        .FirstOrDefaultAsync();

        //    if (project == null) return new List<TaskReportDto>();

            
        //    var tasks = await _tasks.Find(t => t.Project.ProjectId == projectId).ToListAsync();

          
        //    var report = tasks
        //        .GroupBy(t => t.TaskStatus.ToString())
        //        .Select(g => new TaskReportDto
        //        {
        //            Name = g.Key,
        //            Value = g.Count()
        //        })
        //        .ToList();

        //    return report;
        //}


        public async Task<bool> DeleteProjectAsync(string ProjectId, string updatorId, string updatorName)
        {
            var update = Builders<Project>.Update
                .Set(p => p.IsDeleted, true)
                .Set(p => p.Updator, new Updator
                {
                    Id = updatorId,
                    Name = updatorName,
                    UpdatedAt = DateTime.UtcNow
                });

            var result = await _projects.UpdateOneAsync(
                p => p.ProjectId == ProjectId && !p.IsDeleted,
                update
            );

            return result.ModifiedCount > 0;
        }
    }
}
