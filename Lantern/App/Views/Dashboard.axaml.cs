using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace Lantern
{
    public partial class Dashboard : Window
    {
        public Dashboard()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }


    }
}
