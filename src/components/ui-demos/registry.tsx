import type {ComponentType, ReactNode} from 'react';

import * as A11y from './demos/a11y';
import * as Controls from './demos/controls';
import * as Data from './demos/data';
import * as Display from './demos/display';
import * as Feedback from './demos/feedback';
import * as Forms from './demos/forms';
import * as Layout from './demos/layout';
import * as Loading from './demos/loading';
import * as Media from './demos/media';
import * as Motion from './demos/motion';
import * as Navigation from './demos/navigation';
import * as Overlay from './demos/overlay';

export const DEMO_REGISTRY: Record<string, ComponentType> = {
  // 01
  header: Layout.HeaderDemo,
  'sticky-header': Layout.StickyHeaderDemo,
  sidebar: Layout.SidebarDemo,
  footer: Layout.FooterDemo,
  'sticky-action-bar': Layout.StickyActionBarDemo,
  columns: Layout.ColumnsDemo,
  'split-panel': Layout.SplitPanelDemo,
  'list-detail': Layout.ListDetailDemo,
  'responsive-grid': Layout.ResponsiveGridDemo,
  'bento-grid': Layout.BentoGridDemo,
  // 02
  'top-menu': Navigation.TopNavDemo,
  'hamburger-menu': Navigation.HamburgerDemo,
  'bottom-nav': Navigation.BottomNavDemo,
  tabs: Navigation.TabsDemo,
  breadcrumb: Navigation.BreadcrumbDemo,
  'accordion-menu': Navigation.AccordionMenuDemo,
  stepper: Navigation.StepperDemo,
  'page-toc': Navigation.TocDemo,
  pagination: Navigation.PaginationDemo,
  'load-more': Navigation.LoadMoreDemo,
  // 03
  button: Controls.ButtonDemo,
  'icon-button': Controls.IconButtonDemo,
  fab: Controls.FabDemo,
  'button-group': Controls.ButtonGroupDemo,
  segmented: Controls.SegmentedDemo,
  'text-input': Controls.TextInputDemo,
  textarea: Controls.TextareaDemo,
  'checkbox-select-all': Controls.CheckboxDemo,
  radio: Controls.RadioDemo,
  toggle: Controls.ToggleDemo,
  select: Controls.SelectDemo,
  combobox: Controls.ComboboxDemo,
  autocomplete: Controls.AutocompleteDemo,
  slider: Controls.SliderDemo,
  'number-input': Controls.NumberInputDemo,
  'date-picker': Controls.DatePickerDemo,
  'time-picker': Controls.TimePickerDemo,
  'date-range': Controls.DateRangeDemo,
  // 04
  'required-hint': Forms.RequiredHintDemo,
  'inline-validation': Forms.InlineValidationDemo,
  'error-summary': Forms.ErrorSummaryDemo,
  'password-reveal': Forms.PasswordRevealDemo,
  'otp-input': Forms.OtpDemo,
  'dynamic-rows': Forms.DynamicRowsDemo,
  'multi-step-form': Forms.MultiStepFormDemo,
  'save-result': Forms.SaveResultDemo,
  'unsaved-leave': Forms.UnsavedLeaveDemo,
  // 05
  card: Display.CardDemo,
  list: Display.ListDemo,
  badge: Display.BadgeDemo,
  chip: Display.ChipDemo,
  tag: Display.TagDemo,
  avatar: Display.AvatarDemo,
  divider: Display.DividerDemo,
  'description-list': Display.DescriptionListDemo,
  timeline: Display.TimelineDemo,
  'expand-detail': Display.ExpandDetailsDemo,
  'stat-card': Display.StatCardDemo,
  'chart-legend': Display.ChartLegendDemo,
  // 06
  'list-search': Data.ListSearchDemo,
  'filter-chips': Data.FilterChipsDemo,
  sort: Data.SortDemo,
  'infinite-scroll': Data.InfiniteScrollDemo,
  'bulk-actions': Data.BulkSelectDemo,
  'sticky-table': Data.StickyTableDemo,
  'column-config': Data.ColumnToggleDemo,
  'row-expand': Data.RowExpandDemo,
  'inline-edit': Data.InlineEditDemo,
  'narrow-table': Data.NarrowTableDemo,
  // 07
  modal: Overlay.ModalDemo,
  'confirm-dialog': Overlay.ConfirmDeleteDemo,
  drawer: Overlay.DrawerDemo,
  'bottom-sheet': Overlay.BottomSheetDemo,
  tooltip: Overlay.TooltipDemo,
  popover: Overlay.PopoverDemo,
  'dropdown-menu': Overlay.DropdownMenuDemo,
  'context-menu': Overlay.ContextMenuDemo,
  'fullscreen-preview': Overlay.FullscreenPreviewDemo,
  // 08
  toast: Feedback.ToastDemo,
  'snackbar-undo': Feedback.SnackbarUndoDemo,
  'inline-message': Feedback.InlineMessageDemo,
  'announcement-banner': Feedback.BannerDemo,
  'copy-feedback': Feedback.CopyDoneDemo,
  'notification-badge': Feedback.NotificationBadgeDemo,
  'notification-center': Feedback.NotificationCenterDemo,
  // 09
  'button-pending': Loading.ButtonLoadingDemo,
  spinner: Loading.SpinnerDemo,
  skeleton: Loading.SkeletonDemo,
  progress: Loading.ProgressDemo,
  'empty-first': Loading.EmptyFirstVisitDemo,
  'empty-search': Loading.EmptySearchDemo,
  'partial-state': Loading.PartialLoadDemo,
  'error-retry': Loading.ErrorRetryDemo,
  offline: Loading.OfflineDemo,
  forbidden: Loading.ForbiddenDemo,
  // 10
  'press-feedback': Motion.PressFeedbackDemo,
  'hover-focus': Motion.HoverFocusDemo,
  collapse: Motion.CollapseDemo,
  'list-enter': Motion.ListEnterDemo,
  'view-transition': Motion.PageTransitionDemo,
  'drag-sort': Motion.DragSortDemo,
  'swipe-action': Motion.SwipeActionDemo,
  'long-press': Motion.LongPressDemo,
  'pull-refresh': Motion.PullRefreshDemo,
  'reduced-motion': Motion.ReducedMotionDemo,
  // 11
  'file-drop': Media.FileDropDemo,
  'file-validation': Media.FileValidateDemo,
  'upload-progress': Media.UploadProgressDemo,
  'attachment-list': Media.AttachmentListDemo,
  'image-zoom': Media.ImagePreviewDemo,
  gallery: Media.GalleryDemo,
  carousel: Media.CarouselDemo,
  // 12
  'keyboard-nav': A11y.KeyboardNavDemo,
  'focus-order': A11y.FocusRingDemo,
  'modal-focus-trap': A11y.ModalFocusTrapDemo,
  'sr-announcement': A11y.ScreenReaderDemo,
  'contrast-status': A11y.ColorContrastDemo,
  'text-zoom': A11y.TextZoomDemo,
  'color-mode': A11y.ColorModeDemo,
  'touch-target': A11y.TouchTargetDemo,
  landscape: A11y.LandscapeDemo,
  'long-i18n': A11y.LongTranslationDemo,
};

export function renderDemo(id: string): ReactNode {
  const Demo = DEMO_REGISTRY[id];
  if (!Demo) {
    return <p>알 수 없는 데모: {id}</p>;
  }
  return <Demo />;
}
