using System;
using System.Collections.Generic;
using System.Reactive.Linq;
using System.Text;
using System.Windows.Input;
using ReactiveUI;

namespace Lantern
{
    public class MainWindowViewModel : ViewModelBase
    {
        public MainWindowViewModel()
        {
            ShowDialog = new Interaction<DashboardViewModel, AlbumViewModel?>();

            StartCommand = ReactiveCommand.CreateFromTask(async () =>
            {
                var store = new DashboardViewModel();

                var result = await ShowDialog.Handle(store);
            });
        }

        public ICommand StartCommand { get; }

        public Interaction<DashboardViewModel, AlbumViewModel?> ShowDialog { get; }
    }
}
