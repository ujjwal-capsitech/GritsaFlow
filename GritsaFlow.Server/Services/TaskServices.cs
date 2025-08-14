using GritsaFlow.Models;
using GritsaFlow.Server.Models;
using GritsaFlow.Server.Services;
using Microsoft.Win32.SafeHandles;
using MongoDB.Driver;

namespace GritsaFlow.Services
{
    public class TasksServices
    {
        private readonly IMongoCollection<Tasks> _tasks;
        private readonly ProjectTimelineServices _timelineService;
       
        private readonly UserServices _user;

        public TasksServices(IMongoDatabase db, ProjectTimelineServices timelineService,UserServices user)
        {
            _tasks = db.GetCollection<Tasks>("tasks");
            _timelineService = timelineService;
            _user = user;
        }

   
        public async Task CreateTaskAsync(Tasks newTask, string userId, string userName)
        {
            if (newTask.Project == null || string.IsNullOrWhiteSpace(newTask.Project.ProjectId))
                throw new ArgumentException("ProjectId is required");

            // Count tasks for this project
            long count = await _tasks.CountDocumentsAsync(t => t.Project.ProjectId == newTask.Project.ProjectId);

            
            newTask.TaskId = $"{newTask.Project.ProjectId}-{(count + 1).ToString().PadLeft(3, '0')}";

            newTask.Creator = new Creator { Id = userId, Name = userName, CreatedAt = DateTime.UtcNow };
            newTask.IsDeleted = false;

            await _tasks.InsertOneAsync(newTask);
            var user = await _user.GetByidAsync(userId);

            
            await _timelineService.LogActivityAsync(new ProjectTimeLine
            {
                ProjectID = newTask.Project.ProjectId,
                TaskID = newTask.TaskId,
                UserName = user?.Name??userName,
                ActivityDescription = $"Task '{newTask.Title}' created",
                avatarurl = user?.AvatarUrl ?? string.Empty,     
                statefrom = "None",
                stateTo = newTask.TaskStatus.ToString(),
                updator = new Updator { Id = userId, Name = userName, UpdatedAt = DateTime.UtcNow },
                //updatedAt = DateTime.UtcNow
            });
        }


        
        public async Task<List<Tasks>> GetAllAsync() =>
            await _tasks.Find(t => !t.IsDeleted).ToListAsync();

        
        public async Task<Tasks?> GetByIdAsync(string taskId) =>
            await _tasks.Find(t => t.TaskId == taskId && !t.IsDeleted).FirstOrDefaultAsync();

        
        public async Task<Tasks?> EditByIdAsync(string taskId, Tasks updatedTask, string userId, string userName)
        {
            var existingTask = await GetByIdAsync(taskId);
            if (existingTask == null) return null;

            updatedTask.Id = existingTask.Id;
            updatedTask.TaskId = taskId;
            updatedTask.Project.ProjectId = existingTask.Project.ProjectId;
            updatedTask.Creator = existingTask.Creator;
            updatedTask.Updator = new Updator { Id = userId, Name = userName, UpdatedAt = DateTime.UtcNow };
            var user = await _user.GetByidAsync(userId);
            await _tasks.ReplaceOneAsync(t => t.TaskId == taskId, updatedTask);

            await _timelineService.LogActivityAsync(new ProjectTimeLine
            {
                ProjectID = updatedTask.Project.ProjectId,
                TaskID = updatedTask.TaskId,
                UserName = user?.Name??userName,
                ActivityDescription = $"Task '{updatedTask.Title}' updated",
                statefrom = existingTask.TaskStatus.ToString(),
                stateTo = updatedTask.TaskStatus.ToString(),
                updator = updatedTask.Updator,
                updatedAt = DateTime.UtcNow
            });

            return updatedTask;
        }

        
        public async Task<bool> UpdateDescriptionAsync(string taskId, string newDescription, string userId, string userName)
        {
            var update = Builders<Tasks>.Update
                .Set(t => t.Description, newDescription)
                .Set(t => t.Updator, new Updator { Id = userId, Name = userName, UpdatedAt = DateTime.UtcNow });

            var result = await _tasks.UpdateOneAsync(t => t.TaskId == taskId && !t.IsDeleted, update);
            var user = await _user.GetByidAsync(userId);
            if (result.ModifiedCount > 0)
            {
                await _timelineService.LogActivityAsync(new ProjectTimeLine
                {
                    ProjectID = taskId,
                    TaskID = taskId,
                    UserName = user?.Name ?? userName,
                    ActivityDescription = "Task description updated",
                    updator = new Updator { Id = userId, Name = userName, UpdatedAt = DateTime.UtcNow },
                    updatedAt = DateTime.UtcNow
                });
                return true;
            }

            return false;
        }

        
        public async Task<bool> DeleteByIdAsync(string taskId, string userId, string userName)
        {
            var update = Builders<Tasks>.Update
                .Set(t => t.IsDeleted, true)
                .Set(t => t.Updator, new Updator { Id = userId, Name = userName, UpdatedAt = DateTime.UtcNow });

            var result = await _tasks.UpdateOneAsync(t => t.TaskId == taskId, update);
            var user = await _user.GetByidAsync(userId);
            if (result.ModifiedCount > 0)
            {
                await _timelineService.LogActivityAsync(new ProjectTimeLine
                {
                    ProjectID = taskId,
                    TaskID = taskId,
                    UserName = user?.Name ?? userName,
                    ActivityDescription = "Task deleted",
                    updator = new Updator { Id = userId, Name = userName, UpdatedAt = DateTime.UtcNow },
                    updatedAt = DateTime.UtcNow
                });
                return true;
            }

            return false;
        }
    }
}
