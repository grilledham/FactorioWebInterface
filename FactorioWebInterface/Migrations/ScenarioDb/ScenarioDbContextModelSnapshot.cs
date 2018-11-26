﻿// <auto-generated />
using FactorioWebInterface.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FactorioWebInterface.Migrations.ScenarioDb
{
    [DbContext(typeof(ScenarioDbContext))]
    partial class ScenarioDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024");

            modelBuilder.Entity("FactorioWebInterface.Data.ScenarioDataEntry", b =>
                {
                    b.Property<string>("DataSet");

                    b.Property<string>("Key");

                    b.Property<string>("Value")
                        .IsRequired();

                    b.HasKey("DataSet", "Key");

                    b.HasIndex("DataSet");

                    b.ToTable("ScenarioDataEntries");
                });
#pragma warning restore 612, 618
        }
    }
}