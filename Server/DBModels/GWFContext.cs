using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Server.DBModels
{
    public partial class GWFContext : DbContext
    {
        public GWFContext()
        {
        }

        public GWFContext(DbContextOptions<GWFContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Tag> Tag { get; set; }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<UserTag> UserTag { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseMySql("server=db;port=3306;user=root;password=123456qaz;database=GWF");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>(entity =>
            {
                entity.ToTable("tag");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.Color)
                    .IsRequired()
                    .HasColumnName("color")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.Comment)
                    .HasColumnName("comment")
                    .HasColumnType("tinytext");

                entity.Property(e => e.Date)
                    .HasColumnName("date")
                    .HasColumnType("varchar(10)");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.Position)
                    .IsRequired()
                    .HasColumnName("position")
                    .HasColumnType("text");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnName("type")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.Variable)
                    .HasColumnName("variable")
                    .HasColumnType("varchar(20)");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("password")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasColumnName("username")
                    .HasColumnType("varchar(10)");
            });

            modelBuilder.Entity<UserTag>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.TagId });

                entity.ToTable("user-tag");

                entity.HasIndex(e => e.TagId)
                    .HasName("FK_user-tag_tag");

                entity.Property(e => e.UserId)
                    .HasColumnName("userId")
                    .HasColumnType("varchar(20)");

                entity.Property(e => e.TagId)
                    .HasColumnName("tagId")
                    .HasColumnType("varchar(20)");

                entity.HasOne(d => d.Tag)
                    .WithMany(p => p.UserTag)
                    .HasForeignKey(d => d.TagId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_user-tag_tag");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserTag)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_user-tag_user");
            });
        }
    }
}
