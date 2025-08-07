using GritsaFlow.Server.Models;
using GritsaFlow.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace GritsaFlow.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectTimeLineControllers : ControllerBase
    {
        private readonly ProjectTimelineServices _projectTimelineServices;

        public ProjectTimeLineControllers(ProjectTimelineServices projectTimelineServices)
        {
            _projectTimelineServices = projectTimelineServices;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<TimelineItemDTO>>>> GetAll()
        {
            var projectTimeline = await _projectTimelineServices.GetAllAsync();

            var timelineItems = projectTimeline.Select(item => new TimelineItemDTO
            {
                Id = item.TaskID ?? Guid.NewGuid().ToString(), // fallback if TaskID is null
                UserName = item.UserName ?? "Unknown",
                AvatarUrl = item.avatarurl ?? "",
                DateTime = item.updatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                Description = item.ActivityDescription ?? "",
                TaskLink = string.IsNullOrEmpty(item.TaskID) ? "" : $"/tasks/{item.TaskID}",
                FromLabel = item.statefrom,
                ToLabel = item.stateTo
            }).ToList();

            return Ok(ApiResponse<List<TimelineItemDTO>>.Ok(timelineItems));
        }
        [HttpGet("{projectId}")]
        public async Task<ActionResult<ApiResponse<List<ProjectTimeLine>>>> GetByProjectId(string projectId)
        {
            var projectTimeLine = await _projectTimelineServices.GetByProjectIdAsync(projectId);
            var timelineItems = projectTimeLine.Select(item => new TimelineItemDTO
            {
                Id = item.TaskID ?? Guid.NewGuid().ToString(), // fallback if TaskID is null
                UserName = item.UserName ?? "Unknown",
                AvatarUrl = item.avatarurl ?? "",
                DateTime = item.updatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                Description = item.ActivityDescription ?? "",
                TaskLink = string.IsNullOrEmpty(item.TaskID) ? "" : $"/tasks/{item.TaskID}",
                FromLabel = item.statefrom,
                ToLabel = item.stateTo
            }).ToList();

            return Ok(ApiResponse<List<TimelineItemDTO>>.Ok(timelineItems));
        }
    }
}
