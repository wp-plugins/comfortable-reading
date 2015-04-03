<?php
/**
* Plugin Name: Comfortable Reading
* Plugin URI: http://wordpress-club.com/comfortable-reading
* Description: Tool for visually impaired users.
* Version: 1.0
* Author: Flaeron
* Author URI: http://wordpress-club.com/
*/

/*  Copyright 2015 Flaeron  (email : d.flaeron@gmail.com)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

add_action('wp_enqueue_scripts', 'add_cr_custom_styles');

function add_cr_custom_styles() {
	wp_enqueue_style ('css-style', plugins_url('css/custom.css', __FILE__));
}

add_action('wp_enqueue_scripts','add_cr_script');

function add_cr_script(){
	wp_register_script('add_cr_script',plugin_dir_url( __FILE__ ).'js/jquery.comfortable.reading.js', array('jquery'),'1.1', true);
	wp_enqueue_script('add_cr_script');
}

add_action('wp_enqueue_scripts','cr_cookie');

function cr_cookie(){
	wp_register_script('cr_cookie',plugin_dir_url( __FILE__ ).'js/jquery.cookie.js', array('jquery'),'1.1', true);
	wp_enqueue_script('cr_cookie');
}

add_shortcode( 'cr', 'caption_shortcode' );

function caption_shortcode( $atts, $content = null ) {
   return '<a href="#" id="cr_version_link">' . $content . '</a>';
}

class wp_cr_plugin extends WP_Widget {

    function wp_cr_plugin() {
        parent::WP_Widget(false, $name = __('Comfortable Reading', 'comfortable-reading') );
    }

	function form($instance) {

	if( $instance) {
		 $text = esc_attr($instance['text']);
	} else {
		 $text = '';
	}
	?>

	<p>
	<label for="<?php echo $this->get_field_id('text'); ?>"><?php _e('Текст кнопки:', 'comfortable-reading'); ?></label>
	<input class="wide" id="<?php echo $this->get_field_id('text'); ?>" name="<?php echo $this->get_field_name('text'); ?>" type="text" value="<?php echo $text; ?>" />
	</p>

	<?php
	}

	function update($new_instance, $old_instance) {
		  $instance = $old_instance;
		  $instance['text'] = strip_tags($new_instance['text']);
		 return $instance;
	}
	
	function widget($args, $instance) {
	   extract( $args );
	   $text = $instance['text'];
	   echo $before_widget;
	   echo '<div id="cr_widget">';

	   if( $text ) {
		  echo '<a href="#" id="cr_version_link">'.$text.'</a>';
	   };
	   echo '</div>';
	   echo $after_widget;
	}
}

add_action('widgets_init', create_function('', 'return register_widget("wp_cr_plugin");'));