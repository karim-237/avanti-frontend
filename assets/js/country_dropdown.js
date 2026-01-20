$(document).ready(function() {
    var $dropdown = $('#lang-dropdown');
    var $button = $('.lang-dropdown');

    // Toggle dropdown on button click
    $button.on('click', function(e) {
        e.stopPropagation();
        if ($dropdown.is(':visible')) {
            closeDropDown();
        } else {
            openDropDown();
        }
    });

    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$dropdown.is(e.target) && $dropdown.has(e.target).length === 0 &&
            !$button.is(e.target) && $button.has(e.target).length === 0) {
            closeDropDown();
        }
    });

    function openDropDown() {
        $dropdown.stop(true, true).slideDown(300).addClass('open');
    }

    function closeDropDown() {
        $dropdown.stop(true, true).slideUp(300).removeClass('open');
    }
});
