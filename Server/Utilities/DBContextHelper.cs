using Microsoft.EntityFrameworkCore;
using System;

namespace Vis.Utilities
{
    public static class DBContextHelper
    {
        public static TOut Worker<TContext, TOut>(Func<TContext, TOut> func) where TContext : DbContext
        {
            using (var context = Activator.CreateInstance<TContext>())
            {
                return func(context);
            }
        }

        public static void Worker<TContext>(Action<TContext> action) where TContext : DbContext
        {
            using (var context = Activator.CreateInstance<TContext>())
            {
                action(context);
            }
        }
    }
}
