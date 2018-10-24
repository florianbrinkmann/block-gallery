/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './styles/style.scss';
import './styles/editor.scss';
import icons from './../../utils/icons';
import Edit from './components/edit';
import { BackgroundStyles } from '../../components/background/';
import { GlobalAttributes, GlobalTransforms, GlobalClasses, GlobalStyles } from '../../components/global/';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { RichText } = wp.editor;

/**
 * Block constants.
 */
const blockName = __( 'Masonry' );

const blockIcon = icons.masonry;

const blockKeywords = [
	__( 'gallery' ),
	__( 'images' ),
	__( 'photos' ),
];

const blockAttributes = {
	...GlobalAttributes,

	// Block specific attributes.
	gridSize: {
		type: 'string',
		default: 'xlrg',
	},
};

/**
 * Block registration
 */
registerBlockType( 'blockgallery/masonry', {

	title: blockName,

	description: __( 'Display multiple images in an organized masonry gallery.' ),

	icon: {
		src: blockIcon,
	},

	category: 'block-gallery',

	keywords: blockKeywords,

	attributes: blockAttributes,

	supports: {
		align: [ 'wide', 'full' ],
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'blockgallery/stacked' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/masonry', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/carousel' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/masonry', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/thumbnails' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/masonry', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/offset' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/masonry', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'blockgallery/auto-height' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/masonry', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => (
					createBlock( 'blockgallery/masonry', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => (
					createBlock( 'core/gallery', {
						...GlobalTransforms( attributes ),
					} )
				),
			},
		],
	},

	edit: Edit,

	save( { attributes } ) {

		const {
			gridSize,
			gutter,
			gutterMobile,
			images,
			linkTo,
		} = attributes;

		const wrapperClasses = classnames(
			...GlobalClasses( attributes ), {
				[ `has-gutter` ] : gutter > 0,
			}
		);

		const wrapperStyles = {
			...BackgroundStyles( attributes ),
		};

		const ulClasses = classnames(
			`has-grid-${ gridSize }`, {
				[ `has-gutter-${ gutter }` ] : gutter > 0,
				[ `has-gutter-mobile-${ gutterMobile }` ] : gutterMobile > 0,
			}
		);

		const ulStyles = {
			...GlobalStyles( attributes ),
		};

		return (
			<div
				className={ wrapperClasses }
				style={ wrapperStyles }
			>
				<ul
					className={ ulClasses }
					style={ ulStyles }
					>
					{ images.map( ( image ) => {
						let href;

						switch ( linkTo ) {
							case 'media':
								href = image.url;
								break;
							case 'attachment':
								href = image.link;
								break;
						}

						const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ image.id ? `wp-image-${ image.id }` : null } />;

						return (
							<li key={ image.id || image.url } className="blockgallery--item">
								<figure className="blockgallery--figure">
									{ href ? <a href={ href }>{ img }</a> : img }
									{ image.caption && image.caption.length > 0 && (
										<RichText.Content tagName="figcaption" className="blockgallery--caption" value={ image.caption } />
									) }
								</figure>
							</li>
						);
					} ) }
				</ul>
			</div>
		);
	},
} );

export { blockName, blockIcon };