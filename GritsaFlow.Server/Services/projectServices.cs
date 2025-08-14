using GritsaFlow.DTOs;
using GritsaFlow.Models;
using GritsaFlow.Server.Services;
using MongoDB.Driver;

namespace GritsaFlow.Services
{
    public class projectServices
    {
        private readonly IMongoCollection<Project> _projects;
        private readonly IMongoCollection<Tasks> _tasks;
        private readonly IMongoCollection<User> _user;

        public projectServices(IMongoDatabase db)
        {
            _projects = db.GetCollection<Project>("projects");
            _tasks = db.GetCollection<Tasks>("tasks");
            _user = db.GetCollection<User>("user");
        }

        public async Task CreateProjectAsync(Project newProject, string creatorId, string creatorName)
        {
            newProject.Creator = new Creator
            {
                Id = creatorId,
                Name = creatorName,
                CreatedAt = DateTime.UtcNow
            };

            await _projects.InsertOneAsync(newProject);

            newProject.IsDeleted = false;

            //if (newProject.Employees != null)
            //{
            //    foreach (var employee in newProject.Employees)
            //    {
            //        var filter = Builders<User>.Filter.Eq(u => u.UserId, employee.EmpId); //trying to update Object in an List 

            //        var update = Builders<User>.Update.Set(u => u.Project, new projects
            //        {
            //            ProjectId = newProject.ProjectId,
            //            projectTitle = newProject.ProjectTitle
            //        });

            //        var result = await _user.UpdateOneAsync(filter, update);
            //        Console.WriteLine($"Matched: {result.MatchedCount}, Modified: {result.ModifiedCount}");

            //    }
            //}

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
        public async Task<List<EmployeeRef>> GetAllProjectEmpAsync()
        {
            var employeeLists = await _projects
                .Find(p => !p.IsDeleted)
                .Project(p => p.Employees)
                .ToListAsync();

            
            return employeeLists.SelectMany(e => e).ToList();
        }


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
        public async Task<List<EmployeeRef>?> GetProjectEmployeesAsync(string projectId)
        {
            return await _projects
                .Find(p => p.ProjectId == projectId && !p.IsDeleted)
                .Project(p => p.Employees)
                .FirstOrDefaultAsync();
        }

    }
}
