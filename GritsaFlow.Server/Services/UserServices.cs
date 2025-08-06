//Services/UserServices.cs
using GritsaFlow.DTOs;
using GritsaFlow.Models;
using MongoDB.Driver;
using System.Security.Cryptography;


namespace GritsaFlow.Services
{
    public class UserServices
    {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _config;

        public UserServices(IMongoDatabase db, IConfiguration config)
        {
            _users = db.GetCollection<User>("Users");
            _refreshTokens = db.GetCollection<RefreshToken>("RefreshTokens");
            _config = config;

            // Ensure TTL(Time to live) index is created (only runs once)
            var indexKeys = Builders<RefreshToken>.IndexKeys.Ascending(t => t.ExpiryDate);
            var indexOptions = new CreateIndexOptions { ExpireAfter = TimeSpan.Zero };
            var indexModel = new CreateIndexModel<RefreshToken>(indexKeys, indexOptions);
            _refreshTokens.Indexes.CreateOne(indexModel);
        }


        public async Task<UserDTO?> AuthenticateAsync(string username, string password)
        {
            var user = await _users.Find(u => u.UserName == username).FirstOrDefaultAsync();
            if (user == null || !Bc.EnhancedVerify(password, user.Password)) return null;

            return new UserDTO
            {
                UserId = user.UserId,
                Name = user.Name,
                Role = user.Role,
                UserName = user.UserName,
                Email = user.Email,
                Password = user.Password,
                AvatarUrl = user.AvatarUrl
            };
        }
        public async Task<User?> GetByidAsync(string UserId)=>
            await _users.Find(u => u.UserId == UserId).FirstOrDefaultAsync();
        


        public async Task<UserDTO> RegisterAsync(RegisterDTO dto)
        {
            var userId = dto.UserId;

            if (string.IsNullOrEmpty(userId))
            {

                long count = await _users.CountDocumentsAsync(_ => true);
                long next = count + 1;
                userId = $"U-{next.ToString().PadLeft(2, '0')}";
            }
            var user = new User
            {
                Name = dto.Name,
                UserName = dto.UserName,
                Password = Bc.EnhancedHashPassword(dto.Password),
                Email = dto.Email,
                Role = dto.Role,
                AvatarUrl = dto.AvatarUrl,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                
            };
            await _users.InsertOneAsync(user);

            return new UserDTO
            {
                UserId = user.UserId,
                Name = user.Name,
                Role = user.Role,
                UserName = user.UserName,
                Email = user.Email,
                Password = user.Password,
                AvatarUrl = user.AvatarUrl,
            };
        }
       
        public async Task<bool> IsDeletedAsync(string UserId)
        {
            var user = await _users.Find(u => u.Id == UserId).FirstOrDefaultAsync();
            return user?.IsDeleted ?? false;
        }

        private readonly IMongoCollection<RefreshToken> _refreshTokens;


        public async Task StoreRefreshTokenAsync(string userId, string token, DateTime expiry)
        {
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = token,
                ExpiryDate = expiry
            };

            await _refreshTokens.InsertOneAsync(refreshToken);
        }

        public async Task<UserDTO?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            var tokenEntry = await _refreshTokens.Find(r => r.Token == refreshToken && r.ExpiryDate > DateTime.Now).FirstOrDefaultAsync();
            if (tokenEntry == null) return null;

            var user = await _users.Find(u => u.UserId == tokenEntry.UserId).FirstOrDefaultAsync();
            if (user == null) return null;

            return new UserDTO
            {
                UserId = user.UserId,
                Name = user.Name,
                Role = user.Role,
                UserName = user.UserName,
                Email = user.Email,
                Password = user.Password,
                AvatarUrl = user.AvatarUrl,

            };
        }

        // Delete a specific token (e.g., on logout or token rotation)
        public async Task DeleteRefreshTokenAsync(string token)
        {
            await _refreshTokens.DeleteOneAsync(r => r.Token == token);
        }

        // Delete all tokens for a user (optional, e.g., logout from all devices)
        public async Task DeleteAllRefreshTokensForUserAsync(string userId)
        {
            await _refreshTokens.DeleteManyAsync(r => r.UserId == userId);
        }

    }
}
