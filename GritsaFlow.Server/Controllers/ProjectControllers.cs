using GritsaFlow.DTOs;
using GritsaFlow.Models;
using GritsaFlow.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using GritsaFlow.Server.DTOs;
using System.Linq;

namespace GritsaFlow.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectControllers : ControllerBase
    {
        private readonly projectServices _projectservices;


        public ProjectControllers(projectServices projectservices)
        {
            _projectservices = projectservices;
        }

        private (string Id, string Name) GetUserContext()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "system";
            var userName = User.Identity?.Name ?? "system";
            return (userId, userName);
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ProjectDTO>>>> GetAll()
        {
            var projects = await _projectservices.GetAllAsync();

            var result = projects.Select(p => new ProjectDTO
            {
                Id = p.Id,
                ProjectId = p.ProjectId.ToUpper(),
                ProjectTitle = p.ProjectTitle,
                ProjectDescription = p.ProjectDescription,
                Employees = p.Employees,
                ProjectStatus = p.ProjectStatus.ToString(),
                DueDate = p.DueDate,
                Creator = p.Creator,
                Updator = p.Updator,
                IsDeleted = p.IsDeleted
            }).ToList();

            return Ok(ApiResponse<List<ProjectDTO>>.Ok(result));
        }



        [HttpPost]

        public async Task<IActionResult> Post(Project newproject)
        {
            var (id, name) = GetUserContext();
            await _projectservices.CreateProjectAsync(newproject, id, name);
            return Ok(ApiResponse<Project>.Ok(newproject));
        }

        [HttpGet("{ProjectId}")]
        public async Task<ActionResult<ApiResponse<Project>>> Get(string ProjectId)
        {
            var project = await _projectservices.GetByidAsync(ProjectId);

            if (project is null)
                return NotFound(ApiResponse<Project>.Error("Project not found."));

            return Ok(ApiResponse<Project>.Ok(project));
        }

        [HttpPatch("{ProjectId}/description")]
        [Authorize(Roles = Roles.Admin + "," + Roles.TeamLead)]
        public async Task<IActionResult> UpdateDescription(string ProjectId, [FromBody] string newDescription)
        {
            var (id, name) = GetUserContext();
            var success = await _projectservices.UpdateDescriptionAsync(ProjectId, newDescription, id, name);

            if (!success)
                return NotFound(ApiResponse.Error("Project not found"));

            return Ok(ApiResponse.Ok("Description updated successfully"));
        }

        [HttpPut("{ProjectId}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Put(string ProjectId, Project updatedProject)
        {
            var (id, name) = GetUserContext();
            var existing = await _projectservices.EditByidAsync(ProjectId, updatedProject, id, name);
            if (existing is null)
                return NotFound("Project not found.");

            return Ok(ApiResponse<Project>.Ok(existing));
        }

        [HttpGet("{projectId}/report")]
        public async Task<IActionResult> GetProjectReport(string projectId)
        {
            var report = await _projectservices.GetProjectReportAsync(projectId);
            return Ok(ApiResponse<ProjectReportResponse>.Ok(report));
        }



        [HttpDelete("{ProjectId}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> Delete(string ProjectId)
        {
            var (id, name) = GetUserContext();
            var success = await _projectservices.DeleteProjectAsync(ProjectId, id, name);

            if (!success)
                return NotFound(ApiResponse.Error("Project not found"));

            return Ok(ApiResponse.Ok("Project deleted successfully"));
        }
        [HttpGet("{ProjectId}/employees")]
        public async Task<ActionResult<ApiResponse<List<EmployeeRef>>>> GetEmployeesByProject(string ProjectId)
        {
            var employees = await _projectservices.GetProjectEmployeesAsync(ProjectId);

            if (employees is null)
                return NotFound(ApiResponse<List<EmployeeRef>>.Error("Project not found or has no employees."));

            return Ok(ApiResponse<List<EmployeeRef>>.Ok(employees));
        }

        [HttpGet("/employees/all")]
        public async Task<ActionResult<ApiResponse<List<ProjectEmployeeDto>>>> GetProjectEmployeesAsync()
        {
            var result = await _projectservices.GetAllProjectEmpAsync();

            if (result == null || result.Count == 0)
                return NotFound(ApiResponse<List<ProjectEmployeeDto>>.Error("No projects found"));

            return Ok(ApiResponse<List<ProjectEmployeeDto>>.Ok(result));
        }


    }
}
