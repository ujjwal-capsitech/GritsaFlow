using GritsaFlow.Models;
using GritsaFlow.Server.Models;
using GritsaFlow.Server.Services;
using GritsaFlow.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace GritsaFlow.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectTimeLineContollers : ControllerBase
    {
        private readonly ProjectTimelineServices _projectTimelineServices;
        public ProjectTimeLineContollers(ProjectTimelineServices projectTimelineServices )
        {
            _projectTimelineServices = projectTimelineServices;
        }
        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProjectTimeLine>>>> GetAll()
        {
            var ProjectTimeLine = await _projectTimelineServices.GetAllAsync();
            return Ok(ApiResponse<List<ProjectTimeLine>>.Ok(ProjectTimeLine));
        }
    }   
}
