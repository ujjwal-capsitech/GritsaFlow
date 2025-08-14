using GritsaFlow.Models;
using GritsaFlow.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace GritsaFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TasksServices _tasksservices;

        public TasksController(TasksServices tasksservices)
        {
            _tasksservices = tasksservices;
        }

        private (string Id, string Name) GetUserContext()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
            var userName = User.Identity?.Name ?? "system";
            return (userId, userName);
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<Tasks>>>> GetAll()
        {
            var tasks = await _tasksservices.GetAllAsync();
            return Ok(ApiResponse<List<Tasks>>.Ok(tasks));
        }

        [HttpGet("{taskId}")]
        public async Task<ActionResult<ApiResponse<Tasks>>> Get(string taskId)
        {
            var task = await _tasksservices.GetByIdAsync(taskId);
            if (task is null)
                return NotFound(ApiResponse<Tasks>.Error("Task not found."));
            return Ok(ApiResponse<Tasks>.Ok(task));
        }

        [HttpPost]
       
        public async Task<IActionResult> Post(Tasks newTask)
        {
            var (id, name) = GetUserContext();
            await _tasksservices.CreateTaskAsync(newTask, id, name);
            return Ok(ApiResponse<Tasks>.Ok(newTask));
        }

        [HttpPut("{taskId}")]
        //[Authorize(Roles = Roles.Admin + "," + Roles.TeamLead)]
        public async Task<IActionResult> Put(string taskId, Tasks updatedTask)
        {
            var (id, name) = GetUserContext();
            var existing = await _tasksservices.EditByIdAsync(taskId, updatedTask, id, name);

            if (existing is null)
                return NotFound(ApiResponse.Error("Task not found."));

            return Ok(ApiResponse<Tasks>.Ok(existing));
        }

        //[HttpPatch("{taskId}/description")]
        //[Authorize(Roles = Roles.Admin + "," + Roles.TeamLead)]
        //public async Task<IActionResult> UpdateDescription(string taskId, [FromBody] string newDescription)
        //{
        //    var (id, name) = GetUserContext();
        //    var success = await _tasksservices.UpdateDescriptionAsync(taskId, newDescription, id, name);

        //    if (!success)
        //        return NotFound(ApiResponse.Error("Task not found."));

        //    return Ok(ApiResponse.Ok("Description updated successfully"));
        //}

        [HttpDelete("{taskId}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(string taskId)
        {
            var (id, name) = GetUserContext();
            var success = await _tasksservices.DeleteByIdAsync(taskId, id, name);

            if (!success)
                return NotFound(ApiResponse.Error("Task not found"));

            return Ok(ApiResponse.Ok("Task deleted successfully"));
        }
    }
}
